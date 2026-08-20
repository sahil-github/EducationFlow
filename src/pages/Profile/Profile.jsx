import ProfileHeaderCard from "../../components/Setting/ProfileHeaderCard";
import Card from "../../components/Card";
import VisibilityIcon from '@mui/icons-material/Visibility';
function Profile() {
    return (
        <div className="max-w-5xl m-8">
            <ProfileHeaderCard
                showViewProfileButton={false}
            />
            <Card className="p-5 m-5">
                <div className="mb-8 flex items-center gap-3">
                    <VisibilityIcon sx={{ fontSize: 20, color: '#fff' }} />
                    <h1 className="font-semibold text-xl">About Me</h1>
                </div>


            </Card>

        </div>
    );
}
export default Profile;
